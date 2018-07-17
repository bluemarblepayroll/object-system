export declare namespace Broker {
    interface ReceiveMessageFunc {
        (args: Record<string, any>): void;
    }
    interface Object {
        receive?: Record<string, ReceiveMessageFunc>;
        receiveMessage?(action: string, args: Record<string, any>): void;
    }
    interface Constructor {
        (name: string, config: Record<string, any>, arg: any): Object;
    }
    function register(type: string, constructor: Constructor, overwrite?: boolean): void;
    function make(type: string, name: string, config: any, arg: any, overwrite?: boolean): void;
    function assign(name: string, obj: Object, overwrite?: boolean): void;
    function message(name: string, action: string, args: Record<string, any>): void;
    function reset(): void;
}
