const initialAction = { type: 'store::init' };

export default class RedChain<stateType, actionType>{
  public state: stateType;
  private initialAction = initialAction;
  private reducers: ((state: stateType, action: actionType | typeof initialAction, previousState: stateType) => stateType)[];
  private onChanges: (() => void)[];
  constructor(reducer: ((state: stateType, action: actionType | typeof initialAction, previousState: stateType) => stateType)) {
    this.reducers = [reducer];
    this.onChanges = [];
    this.state = reducer(null as any, this.initialAction, null as any);
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

  public addReducer(reducer: (state: stateType | null, action: actionType | typeof initialAction) => stateType) {
    this.reducers.push(reducer);

    return this;
  }

  public addOnChange(onChange: () => void) {
    this.onChanges.push(onChange);

    return this;
  }
}
