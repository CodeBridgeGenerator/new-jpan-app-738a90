
import { faker } from "@faker-js/faker";
export default (user,count,calonIds,pelulusIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
nomborrujukan: faker.lorem.sentence(1),
tajuklatihan: faker.lorem.sentence(1),
status: faker.lorem.sentence(1),
calon: calonIds[i % calonIds.length],
pelulus: pelulusIds[i % pelulusIds.length],

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
