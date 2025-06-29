import { Directive, effect, ElementRef, input, OnDestroy, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';

@Directive({
  selector: '[appCountup]',
})
export class Countup implements OnDestroy {
  private animationFrameId: number | null = null;

  public readonly targetValue = input<number>(0);
  public readonly duration = input<number>(2000);

  constructor(
    private readonly element: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2
  ) {
    effect(() => {
      const target = this.targetValue();
      const duration = this.duration();

      if (target !== undefined && target > 0) {
        this.countUp(this.element.nativeElement, target, duration);
      } else {
        this.renderer.setProperty(this.element.nativeElement, 'innerText', '0');
      }
    });

  }

  private countUp(element: HTMLElement, target: number, duration: number): void {
    const startValue = 0;
    const startTime = performance.now();

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(startValue + (target - startValue) * progress);

      this.renderer.setProperty(element, 'innerText', value.toString());

      if (progress < 1) {
        this.animationFrameId = requestAnimationFrame(step);
      } else {
        this.animationFrameId = null;
      }
    };

    this.animationFrameId = requestAnimationFrame(step);
  }

  ngOnDestroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
