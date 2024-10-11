using AutoMapper;
using ITS_APIs.Models;
using ITS_APIs.DTOs;
using ITS_APIs.Enums;

public class MappingProfile : Profile
{
       public MappingProfile()
       {
              CreateMap<CarDto, Car>()
                     .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
              CreateMap<Car, CarDto>()
                     .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));

              CreateMap<User, UserDto>();
              CreateMap<User, UserResponseDto>()
                     .ForMember(dest => dest.isAdmin, opt => opt.MapFrom(src => src.Role == RoleType.admin));


              CreateMap<OrderDto, Order>()
                     .ForMember(dest => dest.CarId, opt => opt.MapFrom(src => src.CarId))
                     .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))
                     .ForMember(dest => dest.Car, opt => opt.Ignore())
                     .ForMember(dest => dest.User, opt => opt.Ignore());

              CreateMap<Order, OrderDto>()
                     .ForMember(dest => dest.CarPlate, opt => opt.MapFrom(src => src.Car.CarPlate))
                     .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.Username));


       }
}
