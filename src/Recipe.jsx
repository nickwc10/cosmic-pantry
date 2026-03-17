import {useState} from 'react'

export default function Recipe({rec}){
    if(!rec) return <div>Loading...</div>
    const steps = rec.strInstructions.split(/\r\n|\n/).map(step=>step.replace(/^step\s*\d+[.:)]*\s*/i, '').trim()).filter(step=>step.trim() !=="")

    return(
        <>
        <OverviewCard rec={rec}/>
        <div className="card p-3 mb-3" id="recipe-card">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h2 className="mb-0">Instructions</h2>
                <div className="btn-group btn-group-sm">
                    <button className="btn btn-outline-secondary">Normal</button>
                    <button className="btn btn-outline-secondary">Pirate</button>
                    <button className="btn btn-outline-secondary">Shakespeare</button>
                </div>
            </div>
            <div className="card-body"id="instruction-card">   
                    <ol>
                        {steps.map((step,i)=> <li key={i} className="mb-2">{step}</li>)}
                    </ol>
                </div>
        </div>
        </>
    )
}

function OverviewCard({rec}){
    return (
        <div className="card mb-3" id='overview-card'>
            <div className="row g-0"> 
                <div className="col-3 d-flex align-items-center ps-3">
                    <div className="card rounded mx-auto mb-3" id="thumbnail">            
                        <img src={rec.strMealThumb} className="card-img object-fit-scale" alt="..."style={{height: 'max-content', width: '100%'}}></img>
                    </div>
                </div>
                <div className="col-9">
                    <div className="card-body">
                        <h5 className="card-title text-center">Recipe Name: {rec.strMeal} </h5>
                        <p className="card-text text-center"> <strong>Cuisine:</strong> {rec.strArea}</p>
                    </div>
                    <Ingredients rec={rec}/>
                </div>
            </div>
        </div>
    )
}

function Ingredients({rec}){
    if(!rec) return <div>Loading...</div>
    const ingredients = Array.from({length: 20}, (_, i) => ({
          ingredient: rec[`strIngredient${i+1}`],
          measure: rec[`strMeasure${i+1}`]
      })).filter(item => item.ingredient && item.ingredient.trim() !== '')        
      return (

        <div className="card p-3 mb-3 text-bg-dark bg-opacity-50 rounded"id='ingredients-card'>
            <h5>Ingredients</h5>
                <ul className="list-unstyled">
                    {ingredients.map((item, i) => (
                        <li key={i}>{item.ingredient}: {item.measure}</li>
                    ))}
                 </ul>
        </div>
        )
}

