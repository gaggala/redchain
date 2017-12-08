type initialAction = {
  type: 'store::init';
};

type onChangeCallback<actionType> = ((lastAction: actionType) => void);

interface reducer<stateType, actionType> {
  (state: stateType | null, action: actionType | initialAction): stateType;
}

export default class Store<stateType, actionType>{
  public state: stateType;
  private initialAction: initialAction = { type: 'store::init' };
  private reducer: reducer<stateType, actionType>;
  private onChanges: onChangeCallback<actionType>[];
  constructor(reducer: reducer<stateType, actionType>) {
    this.reducer = reducer;
    this.onChanges = [];
    this.state = this.reducer(null, this.initialAction);
  }

  /**
   * this function triggers the reducer
   * when the returnvalue is unequal to the previous state it will trigger the listeners from addOnChange
   */
  public dispatch(action: actionType) {
    const currentState = this.reducer(this.state, action);

    if (this.state !== currentState) {
      this.state = currentState;
      this.onChanges.forEach((onChange) => {
        // currently no other listeners will get notified, when the following line will fuck up
        // try-catch should be avoided, to improve debuggability
        // setTimeout would break the call-stack
        // If you have an opinion on this matter, please make a github issue and tell me
        onChange(action);
      });
    }

    return this;
  }

  /**
   * takes listeners, when the reducer returnvalue is triggered they
   */
  public addOnChange(onChange: onChangeCallback<actionType>) {
    this.onChanges.push(onChange);

    return this;
  }

  /**
   * takes listeners, when the reducer returnvalue is triggered they
   * and returns true, when something changed
   */
  public removeOnChange(removeOnChange: onChangeCallback<actionType>) {
    const previousLength = this.onChanges.length;
    this.onChanges = this.onChanges.filter((currentOnChange: onChangeCallback<actionType>) => currentOnChange !== removeOnChange);

    return previousLength !== this.onChanges.length;
  }
}

