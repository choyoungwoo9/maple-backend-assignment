export class AuthException extends Error {
	constructor({ message, cause }: { message: string; cause?: Error }) {
		super(message, { cause });
		this.name = new.target.name;
	}
}
