export class ConversionUtilities
{
	public static utf8ToB64(str: string): string
	{
		return window.btoa(unescape(encodeURIComponent(str)));
	}

	public static b64ToUtf8(str: string): string
	{
		return decodeURIComponent(escape(window.atob(str)));
	}
}