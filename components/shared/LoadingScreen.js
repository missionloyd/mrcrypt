import CircularProgress from '@material-ui/core/CircularProgress';

function Loading() {
  return(
    <center style={{ display: 'grid', placeItems: 'center', height: '100vh',}}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <img 
          src='/spock.gif'
          alt=''
          style={{ 
            marginBottom: '50px',
            borderRadius: '5px'
          }}
          height={200}
        />
        <CircularProgress color="primary" style={{ width: '50px', height: '50px' }}/>
      </div>
    </center>
  );
}

export default Loading;