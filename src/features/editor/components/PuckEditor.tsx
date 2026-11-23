import { useNavigate } from '@tanstack/react-router';
import { Button, Puck } from '@puckeditor/core';
import '@puckeditor/core/puck.css';
import { initialPageData, puckConfig } from '@/features/editor/config/puck-config';

export function PuckEditor() {
  const navigate = useNavigate();

  return (
    <div className="h-dvh w-full">
      <Puck
        config={puckConfig}
        data={initialPageData}
        headerTitle="CMS Law"
        headerPath="/"
        height="100dvh"
        _experimentalFullScreenCanvas
        overrides={{
          headerActions: ({ children }) => (
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  void navigate({ to: '/preview' });
                }}
              >
                Preview
              </Button>
              {children}
            </>
          ),
        }}
      />
    </div>
  );
}
