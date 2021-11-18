pedHandler = {}
pedHandler.__index = pedHandler

function pedHandler:create(data)
    if not data.pos then
        print("Create a ped without pos is prohibited")
        return
    end

    debug:print("create a ped with model ",data.model)

    local pedInfo = {
        model = data.model or config.defaultPed,
        pos = data.pos,
        heading = data.heading or 0.0,
        isNetwork = data.isNetwork or false,
        bScriptHostPed = data.bScriptHostPed or false,
        maxLoading = data.maxLoading or config.defaultMaxModelLoading,
        unlimitedLoading = data.unlimitedLoading or false,
    }
    if IsModelValid(pedInfo.model) then
        pedInfo.modelHashed = pedInfo.model
    else
        pedInfo.modelHashed = GetHashKey(pedInfo.model)
    end
    setmetatable(pedInfo,pedHandler)

    local x = 0
    RequestModel(pedInfo.modelHashed)
    while (pedInfo.unlimitedLoading or (x<pedInfo.maxLoading)) and not HasModelLoaded(pedInfo.modelHashed) do
        Wait(10)
        RequestModel(pedInfo.modelHashed)
        print("loading ",pedInfo.model,pedInfo.modelHashed)
        x = x+1
    end

    if x>=pedInfo.maxLoading then
        return print("Max model loading time reached")
    end

    pedInfo.ped = CreatePed(0, pedInfo.modelHashed, pedInfo.pos.x, pedInfo.pos.y, pedInfo.pos.z, pedInfo.heading, pedInfo.isNetwork, pedInfo.bScriptHostPed)
    SetEntityCoordsNoOffset(pedInfo.ped, pedInfo.pos.x, pedInfo.pos.y, pedInfo.pos.z)
    SetModelAsNoLongerNeeded(pedInfo.modelHashed)
    return pedInfo
end

function pedHandler:FreezeEntityPosition(state)
    self.freeze = state
    FreezeEntityPosition(self.ped, state)
end

function pedHandler:changeModel(newModel)
    local oldPed = self.ped
    local wasFreezed = self.freeze
    self.model = newModel

    self = pedHandler:create({model=self.model, pos=GetEntityCoords(self.ped, false), heading=GetEntityHeading(self.ped), unlimitedLoading=true})
    FreezeEntityPosition(self.ped, wasFreezed)
    DeleteEntity(oldPed)
end