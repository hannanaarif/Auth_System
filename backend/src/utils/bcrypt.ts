import bcrypt from 'bcrypt';

const hashValue = async (value: string,saltRound?:number): Promise<string> => {
    const salt = saltRound || 10;
    const hashedValue = await bcrypt.hash(value, salt);
    return hashedValue;
};

const compareValue = async (value: string, hashedValue: string): Promise<boolean> => {
    const isMatch = await bcrypt.compare(value, hashedValue);
    return isMatch;
};

export { hashValue, compareValue };