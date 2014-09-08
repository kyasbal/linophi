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
    alertwindow(message?: string, buttonOption?: string, onResponse?: IAlertWindowResponseDelegate): void;
}
 