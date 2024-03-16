

// export interface User {
//     id: string,
//     firstName: string,
//     lastName: string,
//     phoneNumber: string,
//     bvn: string,
//     email: string
// }

interface VirtualAccount {
    accountName: string;
    bankName: string;
    accountNumber: string;
}

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    bvn: string;
    // Include the virtual account properties
    virtualAccount?: VirtualAccount;
}