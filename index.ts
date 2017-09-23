export default class RedChain <stateType, actionType>{
  private currentState: stateType | null;
  private reducers: ((state: stateType | null, action: actionType, previousState?: stateType | null) => stateType)[];
  constructor(reducers: ((state: stateType | null, action: actionType, previousState?: stateType | null) => stateType)[] = []) {
    this.currentState = null;
    this.reducers = reducers;
  }

  public dispatch(action: actionType) {
    let currentState = this.currentState;
    for (let i = 0; i < this.reducers.length; i += 1) {
      currentState = this.reducers[i](currentState, action, this.currentState);
    }
    this.currentState = currentState;
  }

  public addReducer(reducer: (state: stateType | null, action: actionType) => stateType) {
    this.reducers.push(reducer);
  }
}
