declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";
declare module "*.svg";
declare module "react-dom/client" {
	// typing module default export as `any` will allow you to access its members without compiler warning
	var createRoot: any;
	export {createRoot};
}
