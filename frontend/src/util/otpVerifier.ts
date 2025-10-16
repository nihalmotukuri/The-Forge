
export async function verifyOTP(inputOTP: string, actualOTP: string): Promise<boolean> {
    return inputOTP === actualOTP;
}