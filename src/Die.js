import React from "react"


export default function Die(props)
{   
    const styles = 
    {
        backgroundColor : props.dieInfo.isHeld ? "#59E391" : "white"
    }  
    return (
       <div>
            <h2 
                className="die-face"
                style={styles}
                onClick = {()=>props.fixed(props.dieInfo.id)}
            > 
            {props.dieInfo.value}
            </h2>
       </div>
    )
}