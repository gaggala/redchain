export default class RedChain<stateType, actionType>{
  public state: stateType;
  private reducers: ((state: stateType | null, action: actionType, previousState?: stateType | null) => stateType)[];
  private onChanges: (() => void)[];
  constructor(reducer: ((state: stateType | null, action: actionType, previousState?: stateType | null) => stateType)) {
    this.reducers = [reducer];
    this.onChanges = [];
  }

  public dispatch(action: actionType) {
    let currentState = this.state || null;

    this.reducers.forEach((reducer) => {
      currentState = reducer(currentState, action, this.state || null);
    });

    if (this.state !== currentState) {
      this.state = currentState;
      this.onChanges.forEach((onChange) => {
        onChange();
      });
    }

    return this;
  }

  public addReducer(reducer: (state: stateType | null, action: actionType) => stateType) {
    this.reducers.push(reducer);

    return this;
  }

  public addOnChange(onChange: () => void) {
    this.onChanges.push(onChange);

    return this;
  }
}
