class Parent {
  name: string

  constructor(name: string) {
    this.name = name
  }

  show() {
    console.log('name is: ', this.name)
  }
}
new Parent('test')