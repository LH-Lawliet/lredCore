local msInDay = 86400000
local timer = msInDay/2 -- timer is in ms

local eventToken = nil
AddEventHandler("lcore:updateToken", function (token)
    eventToken = token
    utils:TriggerServerCallback("lcore:getGameTime", eventToken, {}, function (time)
        timer = time
        return
    end)
end)


Citizen.CreateThread(function ()
    while true do
        timer = timer+(msInDay/config.dayTime)*config.updateTimeDelay
        local table = timerToHourMinSec(timer)
        NetworkOverrideClockTime(utils:toInt(table.hour), utils:toInt(table.min), utils:toInt(table.sec))
        Wait(config.updateTimeDelay)
    end
end)


function timerToHourMinSec(t) -- take t as ms
    t = utils:toInt(t/1000)
    local killer = t%(3600*24)
    local hour = utils:inverseModulo(killer,3600)
    local min = utils:inverseModulo(killer-(hour*3600), 60)
    local sec = killer-(hour*3600)-(min*60)
    --[[
    debug:print("t : ",t)
    debug:print("killer : ", killer)
    debug:print("hour : ", hour)
    debug:print("min : ", min)
    debug:print("sec : ", sec)
    debug:print("\n\n\n\n\n\n")
    ]]--
    return {hour=hour, min=min, sec=sec}
end


RegisterNetEvent("lcore:updateGameTime")
AddEventHandler("lcore:updateGameTime", function (updatedTimer)
    timer = updatedTimer
    return
end)


