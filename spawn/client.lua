myPed = nil

local eventToken = nil
AddEventHandler("lcore:updateToken", function (token)
    eventToken = token
end)

Citizen.CreateThreadNow(function ()
    while true do
        Citizen.Wait(50)
        local playerPed = PlayerPedId()
        if playerPed and playerPed ~= -1 and eventToken then
            break
        end
    end

    myPed = playerPedClass:create()
    ShutdownLoadingScreenNui()
end)