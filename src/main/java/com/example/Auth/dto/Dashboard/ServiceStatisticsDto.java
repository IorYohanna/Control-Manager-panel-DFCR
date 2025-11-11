package com.example.Auth.dto.Dashboard;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class ServiceStatisticsDto {
    private String serviceName;
    private int userCount;
    private int eventCount;
    private List<UserInfoDto> users;
}
