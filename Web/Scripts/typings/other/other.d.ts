interface IWindowLoadDelegate {
    (): void;
}
interface Window {
    load: IWindowLoadDelegate;
}
interface IAlertWindowResponseDelegate {
    (response: string): void;
}
interface JQuery {
    alertwindow(message?: string, onResponse?: IAlertWindowResponseDelegate): void;
    alertwindow(message?: string, buttonOption?: string, onResponse?: IAlertWindowResponseDelegate): void;
    alertwindow(message?: string, buttonOption?: string, titleMessage?: string, onResponse?: IAlertWindowResponseDelegate): void;
    alertwindow(message?: string, buttonOption?: string, titleMessage?: string, mainColor?: string, onResponse?: IAlertWindowResponseDelegate): void;
}
 