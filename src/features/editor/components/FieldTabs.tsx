import { Children, type ReactNode } from 'react';
import { FieldGroup, FieldTab } from '@puckeditor/core';

const hasVisibleNodes = (nodes: ReactNode): boolean => Children.toArray(nodes).length > 0;

type FieldTabsProps = {
  content?: ReactNode;
  appearance?: ReactNode;
  layoutGroup?: ReactNode;
};

export function FieldTabs({ content, appearance, layoutGroup }: FieldTabsProps) {
  const showContent = hasVisibleNodes(content);
  const showAppearance = hasVisibleNodes(appearance) || hasVisibleNodes(layoutGroup);

  return (
    <>
      {showContent && <FieldTab label="Content">{content}</FieldTab>}
      {showAppearance && (
        <FieldTab label="Appearance">
          {appearance}
          {hasVisibleNodes(layoutGroup) && (
            <FieldGroup label="Layout" id="layout" collapsible={true} defaultExpanded={true}>
              {layoutGroup}
            </FieldGroup>
          )}
        </FieldTab>
      )}
    </>
  );
}
