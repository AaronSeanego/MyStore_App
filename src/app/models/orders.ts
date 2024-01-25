export class Orders {
    name: string;
    price: BigInteger;
    quantity: string;
    url: string;
    description: string;

    constructor (name: string, price: BigInteger, quantity: string, url: string, description: string) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.url = url;
        this.description = description;
    }
}