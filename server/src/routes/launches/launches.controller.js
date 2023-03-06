const {getAllLaunches, scheduleNewLaunch, existsLaunchWithId, abortLaunchById} = require('../../models/launches.model')

async function httpgetAllLaunches(req,res){
  return res.status(200).json(await getAllLaunches())
}

async function httpaddNewLanch(req,res){
  const launch = req.body 
  if(!launch.mission || !launch.rocket || !launch.launchDate || ! launch.target){
    return res.status(400).json({
      error:'Missing required launch property',
    })
  }
  launch.launchDate = new Date(launch.launchDate)
  if(isNaN(launch.launchDate )){
    return res.status(400).json({
      error: 'Invalid launch date'
    })
  }
  
  await scheduleNewLaunch(launch)
  console.log('Saved launch', launch)
  return res.status(201).json(launch)
}

async function httpAbortLaunch(req,res){
  const launchId = Number(req.params.id)
  const existsLaunch = await existsLaunchWithId(launchId)
  if(!existsLaunch){
    return res.status(404).json({
      error: 'Launch not found'
    })
  }else{
    const aborted = await abortLaunchById(launchId)
    if(!aborted){
      return res.status(400).json({
        errr:'Launch pt aborted'
      })
    }else
      return res.status(200).json({ok:true})
  }
}


module.exports={
    httpgetAllLaunches,
    httpaddNewLanch,
    httpAbortLaunch,
}