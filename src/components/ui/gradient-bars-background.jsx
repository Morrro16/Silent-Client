const calculateHeight = (index, total) => {
  if (total <= 1) return 100

  const position = index / (total - 1)
  const distanceFromCenter = Math.abs(position - 0.5)
  const heightPercentage = Math.pow(distanceFromCenter * 2, 1.2)

  return 30 + (100 - 30) * heightPercentage
}

export default function GradientBarsBackground({
  numBars = 15,
  gradientFrom = 'rgb(255, 0, 0)',
  gradientTo = 'transparent',
  animationDuration = 2,
  className = '',
}) {
  const barCount = Math.max(1, Math.floor(numBars))

  return (
    <div className={`gradient-bars-background ${className}`} aria-hidden="true">
      <div className="gradient-bars-track">
        {Array.from({ length: barCount }, (_, index) => {
          const height = calculateHeight(index, barCount)
          const initialScale = height / 100

          return (
            <div
              key={index}
              className="gradient-bar"
              style={{
                flex: `1 0 calc(100% / ${barCount})`,
                maxWidth: `calc(100% / ${barCount})`,
                background: `linear-gradient(to top, ${gradientFrom}, ${gradientTo})`,
                transform: `scaleY(${initialScale})`,
                animationDuration: `${animationDuration}s`,
                animationDelay: `${index * 0.1}s`,
                '--initial-scale': initialScale,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
