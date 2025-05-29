import React from 'react'
import '../assets/css/loading.css'

const Loading = (
    {
        height = '500px',
        width = '100%',
        size = '150px',
        borderColor = '#ffb703',
        loadingText = 'Loading...'
    }
) => {
    return (
        <div
            style={{
                height,
                width,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
            }}
        >
            <div className='loading__container'
                style={{
                    width: size,
                    height: size,
                    '--loader-border-color': borderColor
                }}
            >
            </div>
            <p
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: borderColor,
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                }}
            >
                {
                    loadingText || 'Loading...'
                }
            </p>

        </div>
    )
}

export default Loading