local msInDay = 86400000
local timer = msInDay/2 -- timer is in ms

local msInDay = 86400000

Citizen.CreateThread(function ()
    while true do
        timer = timer+(msInDay/config.dayTime)*config.updateTimeDelay
        TriggerClientEvent("lcore:updateGameTime", -1, timer)
        Wait(config.updateTimeDelay)
    end
end)

utils:RegisterServerCallback("lcore:getGameTime", function ()
    return timer
end)