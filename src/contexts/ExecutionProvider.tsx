import React, { useCallback, useEffect, useMemo } from "react";
import useAppSelector from "@commons/hooks/useAppSelector";
import useAppDispatch from "@commons/hooks/useAppDispatch";
import { getItemExecutionType } from "@commons/slices/selectors/itemExecutionSelectors";
import { getSelectedItemProp } from "@commons/slices/utils/itemExecutionUtils";
import { ControlBarAction } from "@commons/core/itemBehavior";
import { ItemExecutionItemStatus } from "@commons/slices/types/itemExecutionTypes";
import { ItemTypeKey } from "@commons/models/itemTypeModel";
import ExecutionContext from "@commons/contexts/ExecutionContext";
import {
  finishItemExecution,
  addItemExecutionAttempt,
} from "@commons/slices/itemExecution";
import { setNextExecutionOrder } from "@commons/slices/execution";

export default function ExecutionProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();
  
    const selectedId = useAppSelector((state) => state.itemExecutions.selectedId);
    const itemType = useAppSelector(getItemExecutionType);
    const status = useAppSelector(
      (state) => getSelectedItemProp(state, "status")
    ) as ItemExecutionItemStatus;
    const answer = useAppSelector((state) =>
      getSelectedItemProp(state, "answer")
    );
  
    useEffect(() => {
      if (!selectedId) {
        console.log("✅ Unit completed");
        // navegue para resultado, tela final etc.
        // navigation.navigate("UnitCompleted")
      }
    }, [selectedId]);
  
    const validate = useCallback(() => {
      if (selectedId) {
        dispatch(
          addItemExecutionAttempt({
            itemId: selectedId,
            attempt: {
              answer,
              correct: true,
            },
          })
        );
        dispatch(finishItemExecution(selectedId));
      }
    }, [dispatch, selectedId, answer]);
  
    const next = useCallback(() => {
      dispatch(setNextExecutionOrder());
    }, [dispatch]);
  
    const actions = useMemo((): ControlBarAction[] => {
      console.log("🧩 tipo", itemType);
      console.log("✅ status", status);
      console.log("📝 resposta", answer);
  
      if (!itemType) return [];
  
      switch (itemType) {
        case ItemTypeKey.SINGLE_CHOICE_TEXT:
          if (status === ItemExecutionItemStatus.INITIAL && answer) {
            return [ControlBarAction.VALIDATE];
          }
  
          if (
            status === ItemExecutionItemStatus.CORRECT ||
            status === ItemExecutionItemStatus.VALIDATE_CORRECT
          ) {
            return [ControlBarAction.NEXT];
          }
  
          return [];
  
        default:
          return [];
      }
    }, [itemType, status, answer]);
  
    return (
      <ExecutionContext.Provider value={{ actions, validate, next }}>
        {children}
      </ExecutionContext.Provider>
    );
  }
  
