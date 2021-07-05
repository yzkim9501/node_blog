const { isNickname,isPassword,refPassword } = require('./validation');

test('닉네임은 최소 3자 이상', () => {
    expect(isNickname('as')).toEqual(false);
    expect(isNickname('asd')).toEqual(true);
});

test('닉네임은 alphanumeric', () => {
    expect(isNickname('@@@')).toEqual(false);
    expect(isNickname('123')).toEqual(true);
    expect(isNickname('12a3')).toEqual(true);
    expect(isNickname('asdd')).toEqual(true);
    expect(isNickname('asdd!')).toEqual(false);
});

test('비밀번호는 최소 4자 이상', () => {
    expect(isPassword('as','pw')).toEqual(false);
    expect(isPassword('as','pswd')).toEqual(true);
});

test('비밀번호는 닉네임과 겹치면 안됨', () => {
    expect(isPassword('as','asdf')).toEqual(false);
    expect(isPassword('as','paaa')).toEqual(true);
});
test('비밀번호 확인', () => {
    expect(refPassword('as','asdf')).toEqual(false);
    expect(refPassword('paaa','paaa')).toEqual(true);
});