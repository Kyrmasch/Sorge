from ApplicationService.Dtos.SettingsUrlDto import SettingsUrlDto


class ParseDto(object):
    def __init__(self, url: str):
        self.url = url
        self.settings: SettingsUrlDto = SettingsUrlDto(0, 0)
