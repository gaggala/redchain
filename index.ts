export default class RedChain<stateType, actionType>{
  public state: stateType;
  private reducers: ((state: stateType | null, action: actionType, previousState?: stateType | null) => stateType)[];
  constructor(reducer: ((state: stateType | null, action: actionType, previousState?: stateType | null) => stateType)) {
    this.reducers = [reducer];
  }

  public dispatch(action: actionType) {
    let currentState = this.state || null;
    for (let i = 0; i < this.reducers.length; i += 1) {
      currentState = this.reducers[i](currentState, action, this.state || null);
    }
    this.state = currentState;

    return this;
  }

  public addReducer(reducer: (state: stateType | null, action: actionType) => stateType) {
    this.reducers.push(reducer);

    return this;
  }
}
