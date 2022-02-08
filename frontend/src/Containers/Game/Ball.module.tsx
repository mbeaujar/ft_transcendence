

export default class Ball {

    ballElem:Element;
    constructor(ballElem:Element)
    {
        this.ballElem = ballElem;
    }

    get x() {
        return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--x"));
      }
    
      set x(value) {
        /*this.ballElem.style.setProperty("--x", value)*/
      }

    update(delta:any)
    {
        console.log(this.x);
    }
  }