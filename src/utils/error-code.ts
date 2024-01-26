//100 - error, 200 - success, 300 - info
const errorCode = (code:number) => {
    switch(code){
        case 101: return "invalid-field"
        case 102: return "invalid-email"
        case 103: return "bug-verify-token"
        case 104: return "invalid-code"
        case 105: return "code-expired"
        case 106: return "error-2fa"
        case 107: return "invalid-credentials"
        case 108: return "invalid-accounts"
        case 109: return "no-link-account"
        case 110: return "email-used"
        case 111: return "invalid-password"
        case 112: return "error-token"
        case 113: return "error-email"
        case 114: return "missing-token"
        case 201: return "confirm-email"
        case 202: return "login-success"
        case 203: return "resetpw-success"
        case 204: return "email-verified"
        case 205: return "rspw-sent"
        case 301: return "check-email"
        case 401: return "dn-have-permission"
        case 0: return "error"
        default: return "error"
    }
}
export {errorCode}