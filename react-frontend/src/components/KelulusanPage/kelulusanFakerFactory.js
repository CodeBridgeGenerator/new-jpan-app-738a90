
import { faker } from "@faker-js/faker";
export default (user,count,namaLatihanIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
namaLatihan: namaLatihanIds[i % namaLatihanIds.length],
status: faker.lorem.sentence(1),
komen: faker.lorem.sentence(1),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
