
class Order {
  constructor() {
    this.fields = [];
  }

  static base() {
    return new Order();
  }

  ordersql() {
    let finalstr;
    if (this.fields.length > 0) {
      finalstr = ` order by ${this.fields.join(',')} `;
    }
    return finalstr;
  }

  asc(field) {
    this.fields.push(`${field}`);
    return this;
  }

  desc(field) {
    this.fields.push(`${field} desc`);
    return this;
  }
}

module.exports = Order;
