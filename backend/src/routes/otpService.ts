import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

// const prisma = new PrismaClient({
//     datasourceUrl: process.env.DATABASE_URL
// }).$extends(withAccelerate())

const createPrismaClient = (databaseUrl: string) => {
    return new PrismaClient({
        datasourceUrl: databaseUrl
    }).$extends(withAccelerate());
};

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
};

const storeOTP = async (env: any, email: string, otp: number, otpPurpose: string) => {
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 5);
    const prisma = createPrismaClient(env.DATABASE_URL);


    // const list = await prisma.oTP.findMany({
    //     where: {
    //         email: email
    //     }
    // })

    // let listx = list.map(x => x.otpPurpose === otpPurpose ? x : null);
    // let filteredList = listx.filter(x => x !== null);

    // if (filteredList.length > 0) {
    //     let id = filteredList[0].id;
    //     await prisma.oTP.update({
    //         where: {
    //             id: id,
    //         },
    //         data: {
    //             otp,
    //             createdAt: new Date(),
    //             expiresAt: expirationTime,
    //             otpPurpose: otpPurpose, // Keep the purpose unchanged
    //         }
    //     })
    // }
    // else {
    //     await prisma.oTP.create({
    //         data: {
    //             email,
    //             otp,
    //             createdAt: new Date(),
    //             expiresAt: expirationTime,
    //             otpPurpose,
    //         },
    //     });
    // }

    await prisma.oTP.upsert({
        where: {
            email_otpPurpose: {
                email: email,
                otpPurpose: otpPurpose, // Using composite unique key
            },
        },
        update: {
            otp,
            createdAt: new Date(),
            expiresAt: expirationTime,
            otpPurpose: otpPurpose, // Ensure this field is included
        },
        create: {
            email,
            otp,
            createdAt: new Date(),
            expiresAt: expirationTime,
            otpPurpose,
        },
    });
};

const verifyOTP = async (env: any, email: string, otp: number, otpPurpose: string) => {
    const prisma = createPrismaClient(env.DATABASE_URL);

    const otpRecord = await prisma.oTP.findFirst({
        where: {
            email: email,
            otpPurpose: otpPurpose
        },
    });

    try {
        if (otpRecord) {
            const now = new Date();

            if (now > otpRecord.expiresAt) {
                console.log("OTP has expired");
                return false;
            }

            if (otpRecord.otp === otp) {
                await prisma.oTP.delete({
                    where: {
                        email_otpPurpose: {
                            email: email,
                            otpPurpose: otpPurpose, // Using composite unique key
                        },
                    }
                });

            //     const list = await prisma.oTP.findMany({
            //         where: {
            //             email: email
            //         }
            //     })

            //    let item = list.find(x => x.otpPurpose === otpPurpose);


            //     if (item   ){
            //         let id = item.id;
            //          await prisma.oTP.delete({
            //             where:{
            //                 id: id
            //             }
            //          })       
            //         }
                    
                return true;
            }
        }
        else{
            return false;
        }
    } catch (error) {
        return false;
    }
};
export { generateOTP, storeOTP, verifyOTP };
