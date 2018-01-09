export type onChangeCallback<actionType> = ((lastAction: actionType) => void);

/**
 * gets called when a dispatch with an action is triggered
 */
export interface reducer<stateType, actionType> {
  (state: stateType, action: actionType): stateType;
}

/**
 * thats how a complete store is organized
 */
export interface store {
  <stateType, actionType>(initValue: stateType, reducer: reducer<stateType, actionType>): storeCurry<stateType, actionType>;
}

/**
 * the return value of a new created store looks like this
 */
export interface storeCurry<stateType, actionType> {
  (): storeResult<stateType, actionType>;
}

export interface storeResult<stateType, actionType> {
  /**
   * this value gets replaced, each time the reducer gets called
   */
  state: stateType;

  /**
   *  when the state property should change, thats the way to call it
   */
  dispatch(action: actionType): storeResult<stateType, actionType>;

  /**
   *  eventlisteners when a dispatch caused a change in state
   */
  addOnChange(onChange: onChangeCallback<actionType>): storeResult<stateType, actionType>;

  /**
   * when a eventlistener is not needed, this function should get called
   */
  removeOnChange(removeOnChange: onChangeCallback<actionType>): boolean;
}

const store: store = <stateType, actionType>(initValue: stateType, reducer: reducer<stateType, actionType>): storeCurry<stateType, actionType> => {

  const storeCurry: storeCurry<stateType, actionType> = () => {
    let onChanges: onChangeCallback<actionType>[] = [];

    const result: storeResult<stateType, actionType> = {
      /**
       * holds the actual value of the current store
       */
      state: initValue,

      /**
       * takes listeners, when the reducer returnvalue is triggered they
       */
      addOnChange(onChange: onChangeCallback<actionType>): storeResult<stateType, actionType> {
        onChanges.push(onChange);

        return this;
      },

      /**
       * takes listeners, when the reducer returnvalue is triggered they
       * and returns true, when something changed
       */
      removeOnChange(removeOnChange: onChangeCallback<actionType>) {
        const previousLength = onChanges.length;
        onChanges = onChanges.filter((currentOnChange: onChangeCallback<actionType>) => currentOnChange !== removeOnChange);

        return previousLength !== onChanges.length;
      },

      /**
       * this function triggers the reducer
       * when the returnvalue is unequal to the previous state it will trigger the listeners from addOnChange
       */
      dispatch: null as any,
    };

    /**
     * dispatch got added after creating the scope for the result object, to bind the function to this scope
     */
    result.dispatch = function (this: storeResult<stateType, actionType>, action: actionType) {
      const currentState = reducer(this.state, action);
  
      if (this.state !== currentState) {
        this.state = currentState;
        onChanges.forEach((onChange) => {
          // currently no other listeners will get notified, when the following line will fuck up
          // try-catch should be avoided, to improve debuggability
          // setTimeout would break the call-stack
          // If you have an opinion on this matter, please make a github issue and tell me
          onChange(action);
        });
      }
  
      return this;
    }.bind(result);

    return result;
  };

  return storeCurry;
};

export default store;
