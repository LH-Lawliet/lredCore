RegisterNetEvent("lcore:updateToken")
TriggerServerEvent("lcore:askToken")

--[[
To put where serverEvent are called

local eventToken = nil
AddEventHandler("lcore:updateToken", function (token)
    eventToken = token
end)

]]--

