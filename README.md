# 실행방법

```tsx
docker compose up
```

- 노출된 포트
    - 3000 포트 : Gateway Server
    - 8081 포트 : Auth Mongo Express
    - 8082 포트 : Avent Mongo Express
- 루트 계정 정보
    - ID: root123
    - Password: rootpassword123
- http 파일로 테스트
    - 관리자 플로우 : flow.staff.http
    - 유저 플로우 : flow.user.http

# 구현한 기능

- auth server
    - [x]  유저 회원가입
    - [x]  관리자 등록
    - [x]  로그인
- gateway server
    - [x]  라우팅
    - [x]  JWT 토큰 검증 및 역할 검사
- event server
    - [x]  이벤트 등록
    - [x]  보상 등록

# 구현하지 못한 기능

- event server
    - [ ]  유저 보상 요청
    - [ ]  보상 요청 내역 확인


# API 문서

## 인증 API

| 엔드포인트 | 메서드 | 설명 | 권한 | 요청 본문 | 응답 |
|---------|------|------|------|---------|------|
| `/auth/users/signup` | POST | 유저 회원가입 | 없음 | `{ "id": string, "password": string }` | 201 성공 / 409 ID 중복 |
| `/auth/users/login` | POST | 로그인 | 없음 | `{ "id": string, "password": string }` | 200 `{ "accessToken": string }` / 401 인증 실패 |
| `/auth/staff/register` | POST | 스태프 등록 | Admin | `{ "id": string, "password": string, "role": string }` | 201 성공 / 401 권한 없음 / 409 ID 중복 |

## 이벤트 API

| 엔드포인트 | 메서드 | 설명 | 권한 | 요청 본문 | 응답 |
|---------|------|------|------|---------|------|
| `/event` | POST | 이벤트 생성 | Admin, Operator | 이벤트 생성 정보 | 201 이벤트 정보 |
| `/event/summary` | GET | 이벤트 목록 요약 조회 | 인증된 사용자 | 없음 | 200 이벤트 목록(id, description) |
| `/event/:id` | GET | 특정 이벤트 상세 조회 | 인증된 사용자 | 없음 | 200 이벤트 정보 / 404 이벤트 없음 |


이벤트 생성 요청 본문 예시:
```json
{
  "event": {
    "description": "7일 연속 로그인 시 골드 지급",
    "conditions": [
      {
        "type": "CONSECUTIVE_LOGIN",
        "params": { "days": 7 }
      }
    ],
    "startAt": "2025-05-20T00:00:00.000Z",
    "endAt": "2025-09-30T23:59:59.999Z"
  },
  "rewards": [
    {
      "description": "10000 골드",
      "type": "GOLD",
      "amount": 10000
    }
  ]
}
```


# 주요 설계 고민

## 1. 계층 분리

- 코드의 책임을 명확히 분리하여 유지보수성과 테스트 용이성을 높였습니다.
    - 컨트롤러 : 요청을 받아 적절한 데이터 형식으로 변환해 서비스 계층에 전달 후 결과를 응답
    - 서비스 : 여러 도메인/레포지토리를 조합해 애플리케이션의 핵심 기능 구현
    - 도메인 : 비즈니스 규칙과 상태를 포함하는 객체. 이벤트, 조건, 보상과 같은 핵심 개념을 표현. 외부 의존성 없음.
    - 레포지토리 : 데이터를 영속화 하고 조회
- 계층별로 커스텀 예외를 정의하고, 캡슐화해 상위 계층으로 적절한 형태의 에러만 전파되도록 했습니다.
    - 예) 컨트롤러는 서비스 계층의 예외만 처리하면 되서, 레포지토리 계층에 대해 전혀 모름. 예외조차!

## 2. 깔끔한 코드

- 한 계층의 공통된 try-catch 예외 처리 로직을 데코레이션으로 처리해 코드를 간결하게 했습니다.
    - 예외 처리 전략 인터페이스인 ExceptionWrapStrategy 타입
        
        ```tsx
        export type ExceptionWrapStrategy = (error: Error) => never;
        ```
        
    - ExceptionWrapStrategy 타입으로 컨트롤러 계층의 공통된 예외 처리 구현
        
        ```tsx
        const AuthControllerExceptionWrapStrategy: ExceptionWrapStrategy = (
        	error,
        ) => {
        	if (error instanceof AuthServiceIdDuplicatedException) {
        		throw new ConflictException('ID 중복');
        	}
        	if (error instanceof AuthServiceInvalidCredentialsException) {
        		throw new UnauthorizedException('일치하는 id, password 없음');
        	}
        	if (error instanceof AuthServiceUnauthorizedException) {
        		throw new UnauthorizedException('권한없음');
        	}
        	console.error(error);
        	throw new InternalServerErrorException('서버 오류');
        };
        ```
        
    - 컨트롤러 계층에서 wrapwith 어노테이션과 컨트롤러 예외 처리 strategy으로 try-catch 없이 깔끔하게 예외처리
        
        ```tsx
        @WrapWith(AuthControllerExceptionWrapStrategy)
        export class AuthController {
        	async signupUser(@Body() dto: SignupUserRequestDto): Promise<void> {
        		const { id, password } = dto;
        		await this.authService.signupUser({
        			id,
        			password,
        		});
        		return;
        	}
        }
        ```
        
- 가독성 향상과 실수 방지를 위해 여러 매개변수를 받는 함수는 객체 형태로 파라미터를 전달받도록 구현했습니다.
    - 함수 정의
        
        ```tsx
        static async create({
            id,
            password,
            role,
            createdBy,
        }: {
            id: string;
            password: string;
            role: Role;
            createdBy?: string;
        }) {
           ...
        }
        ```
        
    - 함수 호출
        
        ```tsx
        AccountDomain.create({
            id: rootId,
            password: rootPw,
            role: Role.Admin,
        });
        ```
        
- 인증서버에 단위 테스트와 통합 테스트를 작성하여 쉽고 지속적인 리팩토링이 가능했습니다. 특히 WrapWith 데코레이터 적용 시 통합 테스트가 있어, 기능 변경에도 동작의 일관성을 보장할 수 있었습니다.
    - 단위 테스트
        
        ```tsx
        describe('AccountDomain', () => {
        	const id = 'id123';
        	const password = 'password123';
        	const role = Role.User;
        
        	describe('create', () => {
        		it('id, role이 정확히 설정 되었는지', async () => {
        			const account = await AccountDomain.create({ id, password, role });
        			expect(account.id).toBe(id);
        			expect(account.role).toBe(role);
        		});
        
        		it('노출용 id가 생성되었는지', async () => {
        			const account = await AccountDomain.create({ id, password, role });
        			expect(account.exposedId).toBeDefined();
        		});
        		
        ...
        ```
        
    - 통합 테스트
        
        ```tsx
        describe('스태프 등록 API (POST /auth/staff/register)', () => {
        	let testInfo: TestInfo;
        	let app: INestApplication;
        	let rootAccessToken: string;
        
        	beforeAll(async () => {
        		testInfo = await createTestingApp();
        		app = testInfo.app;
        	});
        
        	beforeEach(async () => {
        		await cleanupDatabase(testInfo);
        		rootAccessToken = await setupRootAdmin(app);
        	});
        ```
        

## 3. 스태프 등록 전략

- 스태프는 회원가입이 아닌 기존 스태프가 등록하는 방식으로 구현했습니다.
- 루트 관리자를 생성한 후, 스태프는 관리자 권한을 가진 계정만 등록할 수 있도록 설계했습니다
    - 애플리케이션 시작마다 루트 관리자가 있는지 확인해 없다면, 생성합니다.
    
    ```tsx
    	async onApplicationBootstrap() {
    		const signupRootAdmin = async () => {
    			const rootId = process.env.AUTH_SERVER_ROOT_ADMIN_ID;
    			const rootPw = process.env.AUTH_SERVER_ROOT_ADMIN_PW;
    			if (!rootId || !rootPw) return;
    
    			const exists = await this.accountRepository.isExistById(rootId);
    			if (!exists) {
    				const root = await AccountDomain.create({
    					id: rootId,
    					password: rootPw,
    					role: Role.Admin,
    				});
    				await this.accountRepository.create(root);
    			}
    		};
    		await signupRootAdmin();
    	}
    ```
    

## 4. 이벤트 활성화 전략

- 스케줄러를 매 분 실행하여 시간 범위 내에 있지만 비활성화된 이벤트를 자동으로 활성화시키는 로직을 구현했습니다

```tsx
@Injectable()
export class EventStatusScheduler {
  private readonly logger = new Logger(EventStatusScheduler.name);

  constructor(private readonly eventRepository: EventRepository) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async activateEvents() {
    const now = new Date();
    const eventsToActivate =
      await this.eventRepository.findInactiveAndOngoingEvents(now);

    for (const event of eventsToActivate) {
      await this.eventRepository.updateStatus(event.id, EventStatus.ACTIVE);
      this.logger.log(`이벤트 활성화: ${event.description}`);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async deactivateEvents() {
    const now = new Date();
    const eventsToDeactivate =
      await this.eventRepository.findActiveAndEndedEvents(now);
    for (const event of eventsToDeactivate) {
      await this.eventRepository.updateStatus(event.id, EventStatus.INACTIVE);
      this.logger.log(`이벤트 비활성화: ${event.description}`);
    }
  }
}
```

## 5. 쉽게 확장 가능한 이벤트, 보상 설계

- 새로운 이벤트 조건이나 보상 유형을 추가할 때 인터페이스 구현 및 팩토리 함수 수정만으로 쉽게 확장할 수 있게 설계했습니다
    - 조건 인터페이스
        - 조건의 파라미터를 any 타입으로 받아 다양한 조건과 보상 구현이 가능하도록 했습니다.
        - 또한 같은 비즈니스 로직을 공유하는 조건이라면, 매개변수 조정만으로 쉽게 이벤트를 생성할 수 있습니다.
        
        ```tsx
        export interface ConditionDomain {
          type: ConditionType;
          params: Record<string, any>;
          isSatisfied(params: Record<string, any>): boolean;
        }
        ```
        
    - 적절한 조건 구현
        
        ```tsx
        //연속 로그인 조건
        class ConsecutiveLoginConditionDomain implements ConditionDomain {
          type = ConditionType.CONSECUTIVE_LOGIN;
          params: { days: number };
        
          constructor(params: { days: number }) {
            this.validateParams(params);
            this.params = params;
          }
        
          private validateParams(params: { days: number }): void {
            if (
              !params ||
              typeof params.days !== 'number' ||
              !Number.isInteger(params.days) ||
              params.days < 1 ||
              params.days > 10000
            ) {
              throw new Error('params.days는 1~10000 사이의 정수여야 합니다.');
            }
          }
        
        	// 이벤트 조건 확인
          // TODO:실제로는 유저의 출석 데이터와 비교해야 하게 다시 구현
          isSatisfied(userData: { consecutiveDays: number }): boolean {
            return userData.consecutiveDays >= this.params.days;
          }
        }
        
        ```
        
    - 조건 생성 팩토리
        
        ```tsx
        export class ConditionDomainFactory {
          static create(type: string, params: Record<string, any>): ConditionDomain {
            switch (type) {
              case ConditionType.CONSECUTIVE_LOGIN:
                return new ConsecutiveLoginConditionDomain(params as any);
              // TODO: 다른 타입 추가
              default:
                throw new Error('지원하지 않는 조건 타입입니다.');
            }
          }
        }
        
        ```
        
    - 이벤트 생성 및 저장
        
        ```tsx
          createEvent(dto: CreateEventRequestDto, authPayload: AuthPayload) {
            if (authPayload.role !== Role.Admin && authPayload.role !== Role.Operator) {
              throw new Error('권한 없음');
            }
            //조건 생성
            const conditions = dto.event.conditions.map((condition) =>
              ConditionDomainFactory.create(condition.type, condition.params),
            );
            //보상 생성
            const rewards = dto.rewards.map((reward) =>
              RewardDomainFactory.create(
                reward.type,
                reward.amount,
                reward.description,
                reward.id,
              ),
            );
            //조건, 보상, 입력 바탕으로 이벤트 생성
            const event = EventDomain.create({
              description: dto.event.description,
              startAt: dto.event.startAt,
              endAt: dto.event.endAt,
              conditions: conditions,
              rewards: rewards,
              creatorExposedId: authPayload.exposedId,
            });
            //이벤트 저장
            return this.eventRepository.create(event);
          }
        ```
        

## 구현하지는 않았지만…

- mongoDB 저장 전략
    - 워크로드에 기반해 최대한 하나의 문서만 읽으면 데이터를 꺼내올 수 있도록 설계합니다.
    - 데이터 중복을 감수하더라도, 조회 성능을 극대화하기 위해서 입니다.
        - 예) 사용자 보상 요청
            - 이벤트 및 보상의 ID만 저장하는 것이 아니라 전체 이벤트와 보상 정보를 저장
            - 보상 요청을 모두 하나의 doc에 저장
- 이벤트 달성 확인 전략
    - 게임 데이터를 백엔드가 관리하지 않는다고 가정합니다.
    - 전략 1
        - 필요 시 게임 서버에 요청해 확인합니다.
        - “유저가 특정 아이템을 구매했는가?” 같은 실시간 데이터가 필요한 경우 유용합니다.
    - 전략 2
        - 매일 특정한 시간마다 cron해 데이터를 직접 저장합니다.
        - “최근(오늘을 제외한) N일간 M번 출석 했는가?” 처럼 실시간 데이터가 필요하지 않은 상황에 유용합니다.

# 개선할 점

## 1. 시간 관리

- 인증서버 구현 시 깔끔한 구조와 코드 작성에 너무 많은 시간을 투자했습니다. 점점 시간에 쫒겨 코드 퀄리티가 내려가고 기능 구현을 마치지 못한게 아쉽습니다.
- 앞으로 시간이 한정된 상황에서는 MVP 개발 후 점진적으로 개선하려 합니다.

## 2. 이벤트 서버 코드 품질

- 테스트 코드가 없어 기능 정상 작동 보장이 어렵습니다
- 컨트롤러 DTO가 서비스 계층까지 그대로 전달되어 계층 분리가 제대로 이루어지지 않았습니다
    
    ```tsx
      @Post()
      async createEvent(@Body() dto: CreateEventDto) { //컨트롤러 DTO임
        return this.eventService.createEvent({
          name: dto.name,
          description: dto.description,
          startTime: dto.startTime,
          endTime: dto.endTime,
          conditionType: dto.conditionType,
          conditionParam: dto.conditionParam,
          rewardType: dto.rewardType, 
          rewardParam: dto.rewardParam
        });
    ```
    
- 컨트롤러에서 예외를 catch하지 않아 500에러가 빈번하게 발생합니다.
    - 사용자가 이벤트 잘못된 형식으로 입력한 경우
    - 존재하지 않는 이벤트를 조회한 경우
