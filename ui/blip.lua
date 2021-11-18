blipHandler = {}
blipHandler.__index = blipHandler

function blipHandler:create(data)
    local blip = {}
    setmetatable(blip, blipHandler)
    if not data.pos then
        debug:print("could'nt add a blip without coords")
        return false
    end

    blip.pos = data.pos
    
    if blip.sprite and type(blip.sprite) == "string" then
        data.sprite = GetHashKey(blip.sprite)   -- see https://github.com/femga/rdr3_discoveries/tree/master/useful_info_from_rpfs/textures/blips
                                                -- https://github.com/femga/rdr3_discoveries/tree/master/useful_info_from_rpfs/textures/blips_mp
    else 
        blip.sprite = data.sprite or 1 
    end
    
    blip.scale = data.scale or 1.0
    blip.rotation = data.rotation or 0
    blip.text = data.text
    blip:show()

    return blip
end


function blipHandler:show()
    self.id = AddBlipForCoord(self.pos.x, self.pos.y, self.pos.z)
    SetBlipSprite(self.id, self.sprite)
    SetBlipScale(self.id, self.scale)
    SetBlipRotation(self.id, self.rotation)

    if self.text then
        Citizen.InvokeNative(0x9CB1A1623062F402, blip, self.text)
    end
end
