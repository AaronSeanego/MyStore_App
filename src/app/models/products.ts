export class Product {
    id: number;
    name: string;
    price: BigInteger;
    url: string;
    description: string;

    constructor (id: number, name: string, price: BigInteger, url:string, description:string) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.url = url;
        this.description = description;
    }
}