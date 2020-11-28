export class CurrentLogin {
    userid: number;
    type: number;   // 登录类型
    loginTime: string;
    identifier = (type: number): string => {
        switch (type) {
            case 0:
                return 'phone';
            case 1:
                return 'email';
            case 2:
                return 'wechat';
            default:
                return null;
        }
    }
}
