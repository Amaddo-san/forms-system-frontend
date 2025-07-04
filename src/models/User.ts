import { Faculty } from "./Faculty";
import { Occupation } from "./Occupation";

export class User {
    id: number; // now required
    universityId: string;
    email: string;
    password: string;
    phoneNumber: string;
    firstName: string;
    middleName: string;
    lastName: string;
    faculty: Faculty;
    occupation: Occupation;

    constructor(
        id: number,
        universityId: string,
        email: string,
        password: string,
        phoneNumber: string,
        firstName: string,
        middleName: string,
        lastName: string,
        faculty: Faculty,
        occupation: Occupation
    ) {
        this.id = id;
        this.universityId = universityId;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.faculty = faculty;
        this.occupation = occupation;
    }
}
export { Faculty, Occupation };
