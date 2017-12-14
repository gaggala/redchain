type initialAction = {
  type: 'store::init';
};

export type onChangeCallback<actionType> = ((lastAction: actionType) => void);

export interface reducer<stateType, actionType> {
  (state: stateType | null, action: actionType | initialAction): stateType;
}

export interface store {
  <stateType, actionType>(reducer: reducer<stateType, actionType>): storeResult<stateType, actionType>;
}

export interface storeResult<stateType, actionType> {
  state: stateType;
  dispatch(action: actionType): storeResult<stateType, actionType>;
  addOnChange(onChange: onChangeCallback<actionType>): storeResult<stateType, actionType>;
  removeOnChange(removeOnChange: onChangeCallback<actionType>): boolean;
}

const store: store = <stateType, actionType>(reducer: reducer<stateType, actionType>): storeResult<stateType, actionType> => {
  let onChanges: onChangeCallback<actionType>[] = [];

  return {
    state: reducer(null, { type: 'store::init' }),
    /**
     * this function triggers the reducer
     * when the returnvalue is unequal to the previous state it will trigger the listeners from addOnChange
     */
    dispatch(action: actionType): storeResult<stateType, actionType> {
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
    },
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
    }
  }
}

export default store;
