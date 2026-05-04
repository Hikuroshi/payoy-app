import { cn } from "@/lib/utils";
import React from "react";

type Step = {
  label: string;
  icon?: React.ReactNode;
};

type StepProgressProps = {
  steps?: Step[];
  currentStep?: number;
};

const defaultSteps: Step[] = [{ label: "Register" }, { label: "Choose plan" }, { label: "Purchase" }, { label: "Receive Product" }];

export default function StepProgress({ steps = defaultSteps, currentStep = 1 }: StepProgressProps) {
  return (
    <div className="relative flex items-start justify-between">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber <= currentStep;
        const isLineActive = stepNumber < currentStep;

        return (
          <div key={step.label} className="relative z-10 flex flex-1 flex-col items-center">
            {index < steps.length - 1 && <div className={cn("absolute left-1/2 top-6 h-1 w-full -translate-y-1/2", isLineActive ? "bg-apps-primary-600" : "bg-muted")} />}

            <div className={cn("z-10 flex size-12 items-center justify-center rounded-full border-4 border-apps-primary-600 text-lg font-medium shadow-sm transition-colors duration-300", isActive ? "bg-apps-primary-200 text-apps-primary-600" : "bg-muted text-foreground")}>
              {step.icon ? step.icon : stepNumber}
            </div>

            <p className={cn("mt-4 whitespace-nowrap text-xs font-bold uppercase tracking-tight text-center", isActive ? "text-foreground" : "text-muted-foreground")}>{step.label}</p>
          </div>
        );
      })}
    </div>
  );
}
