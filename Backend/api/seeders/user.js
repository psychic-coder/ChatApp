import { Chat } from "../models/chat.js";
import { User } from "../models/user.js";
import {faker, simpleFaker} from "@faker-js/faker"




//the faker is used to create demo data ,as in this case its creating demo users 
export const createUser=async(numUsers)=>{
    try {
        const usersPromise=[];
        for (let i=0;i<numUsers;i++){
            const tempUser=User.create({
                name:faker.person.fullName(),
                username:faker.internet.userName(),
                bio:faker.lorem.sentence(10),
                password:"password",
                avatar:{
                    url:faker.image.avatar(),
                    public_id:faker.system.fileName()
                }
            })
            usersPromise.push(tempUser);
        }
        //By using Promise.all, the function ensures that all user creation operations are run in parallel, rather than sequentially. This can significantly improve performance, especially when dealing with a large number of users, as it avoids waiting for each user creation to complete before starting the next one.
        //Promise.all is used here to handle multiple asynchronous user creation operations concurrently and to proceed only once all the operations are complete, ensuring efficient and parallel execution.
        await Promise.all(usersPromise);
        console.log("Users Created !",numUsers);
        //the below line is used eto terminate the code 
        process.exit(1);
    } catch (error) {
        console.log(error)
    }
}

