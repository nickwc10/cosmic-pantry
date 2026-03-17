import {useState} from 'react'

export default function Recipe({rec, matchedKeyword, source}){
    if(!rec) return <div className="text-white-50 text-center py-4">Loading recipe...</div>
    const steps = rec.strInstructions.split(/\r\n|\n/).map(step=>step.replace(/^step\s*\d+[.:)]*\s*/i, '').trim()).filter(step=>step.trim() !=="")

    const matchBadge = source === 'random'
        ? <span className="badge bg-secondary">Random pick</span>
        : <span className="badge bg-secondary">Matched on <strong>"{matchedKeyword}"</strong> from photo {source}</span>

    return(
        <>

        <OverviewCard rec={rec} matchBadge={matchBadge}/>
        <div className="card space-card mb-3 p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Instructions</h5>
            </div>
            <ol className="text-white-85">
                {steps.map((step,i)=> <li key={i} className="mb-2">{step}</li>)}
            </ol>
        </div>
        </>
    )
}

function OverviewCard({rec, matchBadge}){
    return (
        <div className="card space-card mb-3">
            <div className="row g-0">
                <div className="col-3 d-flex align-items-center p-3">
                    <img src={rec.strMealThumb} className="img-fluid rounded" alt={rec.strMeal}/>
                </div>
                <div className="col-9">
                    <div className="card-body">
                        <div className="d-flex align-items-start justify-content-between gap-2 mb-1">
                            <h5 className="card-title mb-0">{rec.strMeal}</h5>
                            {matchBadge}
                        </div>
                        <p className="text-white-85 mb-3">{rec.strCategory} — {rec.strArea}</p>
                        <Ingredients rec={rec}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Ingredients({rec}){
    const ingredients = Array.from({length: 20}, (_, i) => ({
        ingredient: rec[`strIngredient${i+1}`],
        measure: rec[`strMeasure${i+1}`]
    })).filter(item => item.ingredient && item.ingredient.trim() !== '')

    return (
        <>
            <h6 className="text-white text-uppercase" style={{letterSpacing: '1px'}}>Ingredients</h6>
            <ul className="list-unstyled row row-cols-2">
                {ingredients.map((item, i) => (
                    <li key={i} className="col text-white-85">○ {item.measure} {item.ingredient}</li>
                ))}
            </ul>
        </>
    )
}
