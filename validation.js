module.exports = {
    isNickname: (value) => {
        if( value.length <3 || !value.match(/^[0-9a-z]+$/)){
            return false
        }
        return true
    },
    isPassword: (nickName,pw)=>{
        if(pw.length <4 || pw.indexOf(nickName)>-1){
            return false
        }
        return true
    },
    refPassword:(pw,pwcheck)=>{
        if(pw==pwcheck){
            return true
        }
        return false
    }
};