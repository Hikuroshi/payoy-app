import { cn } from "@/lib/utils";
import React from "react";

type Step = {
  label: string;
  icon?: React.ReactNode; // Tambahkan ini agar bisa menerima <HugeiconsIcon />
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
            {/* Garis Penghubung */}
            {index < steps.length - 1 && <div className={cn("absolute left-1/2 top-6 h-1 w-full -translate-y-1/2", isLineActive ? "bg-apps-primary-600" : "bg-muted")} />}

            {/* Lingkaran Ikon */}
            <div className={cn("z-10 flex h-12 w-12 items-center justify-center rounded-full text-lg font-medium border-4 border-apps-primary-600 shadow-sm transition-colors duration-300", isActive ? "bg-apps-primary-200 text-apps-primary-600" : "bg-muted text-foreground")}>
              {/* Cek jika ada ikon, jika tidak tampilkan angka default */}
              {step.icon ? step.icon : stepNumber}
            </div>

            {/* Label */}
            <p className={cn("mt-4 whitespace-nowrap text-xs font-bold uppercase tracking-tight text-center", isActive ? "text-foreground" : "text-muted-foreground")}>{step.label}</p>
          </div>
        );
      })}
    </div>
  );
}
