import { cn } from "@/lib/utils";

type Step = {
  label: string;
};

type StepProgressProps = {
  steps?: Step[];
  currentStep?: number;
};

const defaultSteps: Step[] = [{ label: "Register" }, { label: "Choose plan" }, { label: "Purchase" }, { label: "Receive Product" }];

export default function StepProgress({ steps = defaultSteps, currentStep = 1 }: StepProgressProps) {
  return (
    <div className="w-full rounded-md border bg-background p-8">
      <div className="relative flex items-start justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber <= currentStep;
          const isLineActive = stepNumber < currentStep;

          return (
            <div key={step.label} className="relative z-10 flex flex-1 flex-col items-center">
              {index < steps.length - 1 && <div className={cn("absolute left-1/2 top-6 h-1 w-full -translate-y-1/2", isLineActive ? "bg-primary" : "bg-muted")} />}

              <div className={cn("z-10 flex h-12 w-12 items-center justify-center rounded-full text-lg font-medium", isActive ? "bg-primary text-primary-foreground" : "bg-muted text-foreground")}>{stepNumber}</div>

              <p className="mt-4 whitespace-nowrap text-xl font-medium text-foreground">{step.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
